use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types-generated.ts")]
pub struct UserState {
    pub id: String,
    pub name: String,
    #[serde(with = "picked_serde")]
    #[ts(skip)]
    pub picked: PickedValue,
}

#[derive(Debug, Clone, PartialEq, Eq, TS)]
#[ts(export, export_to = "../../src/types-generated.ts")]
pub enum PickedValue {
    Number(u32),
    Null,
    True,
}

mod picked_serde {
    use super::PickedValue;
    use serde::{Deserialize, Deserializer, Serialize, Serializer};

    pub fn serialize<S>(value: &PickedValue, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match value {
            PickedValue::Number(n) => serializer.serialize_u32(*n),
            PickedValue::Null => serializer.serialize_none(),
            PickedValue::True => serializer.serialize_bool(true),
        }
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<PickedValue, D::Error>
    where
        D: Deserializer<'de>,
    {
        use serde::de::Visitor;
        use std::fmt;

        struct PickedVisitor;

        impl<'de> Visitor<'de> for PickedVisitor {
            type Value = PickedValue;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("a number, null, or true")
            }

            fn visit_u64<E>(self, v: u64) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                Ok(PickedValue::Number(v as u32))
            }

            fn visit_i64<E>(self, v: i64) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                if v >= 0 {
                    Ok(PickedValue::Number(v as u32))
                } else {
                    Err(E::custom("negative number not allowed"))
                }
            }

            fn visit_none<E>(self) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                Ok(PickedValue::Null)
            }

            fn visit_unit<E>(self) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                Ok(PickedValue::Null)
            }

            fn visit_bool<E>(self, v: bool) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                if v {
                    Ok(PickedValue::True)
                } else {
                    Err(E::custom("false not allowed"))
                }
            }
        }

        deserializer.deserialize_any(PickedVisitor)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types-generated.ts")]
pub struct Observer {
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types-generated.ts")]
pub struct StateMessage {
    #[serde(rename = "type")]
    pub message_type: String,
    pub revealed: bool,
    pub users: Vec<UserState>,
    pub observers: Vec<Observer>,
}

impl StateMessage {
    pub fn new(revealed: bool, users: Vec<UserState>, observers: Vec<Observer>) -> Self {
        Self {
            message_type: "State".to_string(),
            revealed,
            users,
            observers,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types-generated.ts")]
#[serde(tag = "type")]
pub enum IncomingMessage {
    #[serde(rename = "PointsChosen")]
    PointsChosen { points: Option<u32> },
    #[serde(rename = "Reveal")]
    Reveal,
    #[serde(rename = "Clear")]
    Clear,
    #[serde(rename = "Ping")]
    Ping,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/types-generated.ts")]
#[serde(tag = "type")]
pub enum OutgoingMessage {
    #[serde(rename = "State")]
    State(StateMessage),
    #[serde(rename = "Identify")]
    Identify { id: String },
}

pub type UID = String;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_type_generation() {
        // This test triggers ts-rs type generation
        UserState::export().unwrap();
        PickedValue::export().unwrap();
        Observer::export().unwrap();
        StateMessage::export().unwrap();
        IncomingMessage::export().unwrap();
        OutgoingMessage::export().unwrap();
    }
}
